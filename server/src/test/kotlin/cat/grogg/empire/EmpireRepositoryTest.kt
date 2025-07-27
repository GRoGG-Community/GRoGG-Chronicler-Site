package cat.grogg.empire

import cat.grogg.setupTestEnvironment
import io.kotest.core.spec.style.ShouldSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe

class EmpireRepositoryTest : ShouldSpec({
    context("EmpireRepository") {
        val injector = setupTestEnvironment()
        val empireRepository = injector.empireRepository

        val testEmpire = Empire(
            id = 1,
            name = "Test Empire",
            lore = "This is a test empire.",
            stats = "Stats data",
            ethics = "Ethics data",
            special = "Special data"
        )

        beforeEach {
            injector.dataSource.connection.createStatement().execute("DELETE FROM empires")
        }

        should("retrieve an empty list when no empires exist") {
            empireRepository.getAll().shouldBeEmpty()
        }

        should("save an empire") {
            val savedEmpire = empireRepository.save(testEmpire)

            val allEmpires = empireRepository.getAll()
            allEmpires.shouldHaveSize(1).first().shouldBe(savedEmpire)
        }

        should("retrieve an empire by ID") {
            val savedEmpire = empireRepository.save(testEmpire)

            val retrievedEmpire = empireRepository.getById(savedEmpire.id)
            retrievedEmpire.shouldBe(savedEmpire)
        }

        should("delete an empire by ID") {
            val savedEmpire = empireRepository.save(testEmpire)

            val deleted = empireRepository.deleteById(savedEmpire.id)
            deleted shouldBe true

            val allEmpires = empireRepository.getAll()
            allEmpires.shouldBeEmpty()
        }
    }
})
