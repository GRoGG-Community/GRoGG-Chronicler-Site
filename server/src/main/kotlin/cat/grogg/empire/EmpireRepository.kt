package cat.grogg.empire

import cat.grogg.Repository
import cat.grogg.extensions.toSequence
import java.sql.ResultSet
import javax.sql.DataSource

class EmpireRepository(
    private val dataSource: DataSource,
    private val idSupplier: () -> Int
) : Repository<Empire, Int> {
    override fun getAll(): List<Empire> = dataSource.connection.use {
        it.createStatement().executeQuery("SELECT * FROM $TABLE_NAME").toSequence().map(::toEmpire).toList()
    }

    override fun deleteById(id: Int): Boolean =
        dataSource.connection.prepareStatement("DELETE FROM $TABLE_NAME WHERE id = ?").use { statement ->
            statement.setInt(1, id)
            return statement.executeUpdate() > 0
        }

    override fun save(entity: Empire): Empire {
        val id = dataSource.connection.prepareStatement(
            """
            INSERT INTO $TABLE_NAME (id, name, lore, stats, ethics, special) VALUES (?, ?, ?, ?, ?, ?) 
            ON CONFLICT (id) DO UPDATE SET 
                name = EXCLUDED.name, 
                lore = EXCLUDED.lore, 
                stats = EXCLUDED.stats, 
                ethics = EXCLUDED.ethics, 
                special = EXCLUDED.special
            returning id
        """.trimIndent()
        ).use { statement ->
            statement.setInt(1, idSupplier())
            statement.setString(2, entity.name)
            statement.setString(3, entity.lore)
            statement.setString(4, entity.stats)
            statement.setString(5, entity.ethics)
            statement.setString(6, entity.special)

            statement.executeQuery().toSequence().first().getInt("id")
        }

        return entity.copy(id = id)
    }

    override fun getById(id: Int): Empire? =
        dataSource.connection.prepareStatement("SELECT * FROM $TABLE_NAME WHERE id = ?").use { statement ->
            statement.setInt(1, id)

            return@use statement.executeQuery().toSequence().map(::toEmpire).firstOrNull()
        }

    override fun getIds(): List<Int> {
        return dataSource.connection.use { conn ->
            conn.createStatement().executeQuery("SELECT id FROM $TABLE_NAME")
                .toSequence()
                .map { it.getInt("id") }.toList()
        }
    }

    companion object {
        const val TABLE_NAME = "main.empires"
        private fun toEmpire(resultSet: ResultSet): Empire {
            return Empire(
                id = resultSet.getInt("id"),
                name = resultSet.getString("name"),
                lore = resultSet.getString("lore"),
                stats = resultSet.getString("stats"),
                ethics = resultSet.getString("ethics"),
                special = resultSet.getString("special")
            )
        }
    }
}