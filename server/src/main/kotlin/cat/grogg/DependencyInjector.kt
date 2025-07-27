package cat.grogg

import cat.grogg.empire.EmpireController
import cat.grogg.empire.EmpireRepository
import org.flywaydb.core.Flyway
import org.http4k.config.Environment
import javax.sql.DataSource

class DependencyInjector(env: Environment) {
    val config = Config(env)
    val dataSource: DataSource = createDataSource(config.jdbcUrl)

    val empireRepository: EmpireRepository = EmpireRepository(dataSource) { idGenerator.getNewId() }
    val idGenerator = IdGenerator(empireRepository)

    val empireController: EmpireController = EmpireController(empireRepository)
    val server: Server = Server(empireController)

    val flyway: Flyway = createFlyway(dataSource)
}