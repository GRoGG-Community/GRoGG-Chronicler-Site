package cat.grogg

import cat.grogg.empire.Empire
import io.github.oshai.kotlinlogging.KotlinLogging
import org.http4k.config.Environment

private val logger = KotlinLogging.logger {}

fun main() {
    val env = Environment.ENV

    val injector = DependencyInjector(env)

    injector.empireRepository.save(Empire(
        id = 1,
        name = "Test Empire",
        lore = "This is a test empire.",
        stats = "Population: 1000, Technology: Advanced",
        ethics = "Peaceful, Democratic",
        special = "None"
    ))

    runMigrationAndVerify(injector.flyway)

    injector.server.asServer().start()
}