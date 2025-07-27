package cat.grogg

import io.github.oshai.kotlinlogging.KotlinLogging
import org.flywaydb.core.Flyway
import javax.sql.DataSource

private val logger = KotlinLogging.logger {}

fun createFlyway(dataSource: DataSource): Flyway {
    return Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration")
        .load()
}

fun runMigrationAndVerify(flyway: Flyway) {
    logger.info { "Running flyway migrations..." }
    flyway.migrate()
    flyway.validate()
    println("Database migration completed successfully.")
}