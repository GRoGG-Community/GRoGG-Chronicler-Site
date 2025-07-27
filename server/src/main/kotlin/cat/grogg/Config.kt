package cat.grogg

import org.http4k.config.Environment
import org.http4k.config.EnvironmentKey
import org.http4k.lens.string

class Config(private val env: Environment) {
    val jdbcUrl: String = jdbcUrl(env)

    companion object {
        val jdbcUrl = EnvironmentKey.string().defaulted("JDBC_URL", "jdbc:sqlite:grogg.sqlite")
    }
}