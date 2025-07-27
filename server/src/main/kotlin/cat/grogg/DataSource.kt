package cat.grogg

import org.sqlite.SQLiteDataSource
import javax.sql.DataSource

fun createDataSource(jdbcUrl: String): DataSource {
    return SQLiteDataSource().apply {
        url = jdbcUrl
    }
}