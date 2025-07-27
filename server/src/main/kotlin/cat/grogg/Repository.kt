package cat.grogg

interface Repository<T, ID> {
    fun getAll(): List<T>
    fun getById(id: ID): T?

    fun existsById(id: ID): Boolean = getById(id) != null

    fun save(entity: T): T
    fun deleteById(id: ID): Boolean

    fun getIds(): List<ID>
}