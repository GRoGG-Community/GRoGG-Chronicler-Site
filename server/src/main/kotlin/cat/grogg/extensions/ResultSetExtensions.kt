package cat.grogg.extensions

import java.sql.ResultSet

fun ResultSet.toSequence() =
    generateSequence {
        if (next()) this else {
            this.close()
            null
        }
    }