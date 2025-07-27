package cat.grogg

import kotlin.random.nextInt

class IdGenerator(
    vararg repositories: Repository<*, Int>
) {
    private val random = kotlin.random.Random(System.currentTimeMillis())
    private val repositories = repositories.toList()

    private fun nextId() = random.nextInt(0..Int.MAX_VALUE)

    private fun getIds() = repositories.flatMap(Repository<*, Int>::getIds)

    fun getNewId(): Int {
        val existingIds = getIds().toSet()

        var id: Int = nextId()

        while (id in existingIds) {
            id = nextId()
        }
        return id
    }
}