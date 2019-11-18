package chat

import cats.effect._
import cats.effect.concurrent.Ref
import cats.implicits._
import chat.ChatPlugin.{PersonalChatPlugin, PublicChatPlugin}
import chat.OutgoingWebsocketMessage.Message
import dev.profunktor.redis4cats.algebra.SetCommands
import dev.profunktor.redis4cats.connection
import dev.profunktor.redis4cats.domain._
import dev.profunktor.redis4cats.interpreter.Redis
import dev.profunktor.redis4cats.interpreter.pubsub.PubSub
import dev.profunktor.redis4cats.log4cats._
import fs2.{Pipe, Stream}
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.lettuce.core.RedisURI

object Main extends IOApp {
  implicit val logger: Logger[IO] = Slf4jLogger.getLogger

  val stringCodec: LiveRedisCodec[String, String] = RedisCodec.Utf8
  val chatChannel: LiveChannel[String]            = LiveChannel("chat")

  val redisEnvUri = sys.env.getOrElse("REDIS_URI", "redis://localhost")

  def run(args: List[String]): IO[ExitCode] =
    stream.compile.drain.as(ExitCode.Success)

  val publicChatPlugins: List[PublicChatPlugin]     = List(Plugins.emote, Plugins.cowsay)
  val personalChatPlugins: List[PersonalChatPlugin] = List(Plugins.highlightUser)

  val plugins = Plugins(publicChatPlugins, personalChatPlugins)

  val stream: Stream[IO, Unit] =
    for {
      redisUri    <- Stream.eval(connection.RedisURI.make[IO](redisEnvUri))
      client      <- Stream.resource(connection.RedisClient[IO](redisUri))
      setCommands <- makeSetCommands(client, redisUri)
      pubsub      <- PubSub.mkPubSubConnection[IO, String, PubSubMessage](client, PubSubCodec, redisUri)
      blocker     <- Stream.resource(Blocker[IO])
      localUsers  <- Stream.eval(Ref.of[IO, Set[String]](Set.empty))
      channel     <- Stream.resource(ChatChannel.makeResource(chatChannel, localUsers, plugins, setCommands, pubsub))
      httpServer = new HttpServer(blocker, channel)
      _ <- httpServer.server.serve
    } yield ()

  def makeSetCommands(client: RedisClient, uri: RedisURI): Stream[IO, SetCommands[IO, String, String]] =
    Stream.resource(Redis[IO, String, String](client, stringCodec, uri))

}

case class Plugins(public: PublicChatPlugin, personal: PersonalChatPlugin) {
  def publicPipe(username: String): Pipe[IO, IncomingWebsocketMessage, IncomingWebsocketMessage] =
    public(username)

  def personalPipe(username: String): Pipe[IO, OutgoingWebsocketMessage, OutgoingWebsocketMessage] =
    personal(username)
}

object Plugins {
  def apply(
      public: List[PublicChatPlugin],
      personal: List[PersonalChatPlugin]
  ): Plugins =
    Plugins(ChatPlugin.makePipe(public), ChatPlugin.makePipe(personal))

  def emote: PublicChatPlugin = ChatPlugin.publicSync { (username, message) =>
    if (message.text.startsWith("/me "))
      message.copy(text = s"$username ${message.text.stripPrefix("/me ")}", isEmote = Some(true))
    else message
  }

  def highlightUser: PersonalChatPlugin = ChatPlugin.personalSync { (currentUser, message) =>
    message match {
      case msg @ Message(_, _, text, _, _) if text.contains(currentUser) =>
        msg.copy(text = msg.text.replace(currentUser, s"<b>$currentUser</b>"))
      case msg => msg
    }
  }

  def cowsay: PublicChatPlugin = ChatPlugin.public { (_, message) =>
    if (message.text.startsWith("/cowsay "))
      IO.delay {
        import sys.process._
        val cowSaid = s"cowsay ${message.text.stripPrefix("/cowsay ")}".!!
        message.copy(text = cowSaid.replaceAll(System.lineSeparator(), "<br>"))
      } else
      IO.pure(message)
  }
}
