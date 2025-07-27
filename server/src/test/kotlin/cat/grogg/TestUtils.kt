package cat.grogg

import org.http4k.config.Environment
import java.nio.file.Files
import kotlin.io.path.absolutePathString


fun setupTestEnvironment(): DependencyInjector {
    val testDatabaseFile = Files.createTempFile("test", "sqlite")

    // Set up the test environment with an in-memory SQLite database
    return DependencyInjector(Environment.from("JDBC_URL" to "jdbc:sqlite:${testDatabaseFile.absolutePathString()}"))
        .also { it.flyway.migrate() }
}