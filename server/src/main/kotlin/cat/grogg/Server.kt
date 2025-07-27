package cat.grogg

import org.http4k.contract.ContractBuilder
import org.http4k.contract.contract
import org.http4k.server.Jetty
import org.http4k.server.asServer

interface RouteProvider {
    fun register(contract: ContractBuilder)
}

class Server(
    vararg routeProviders: RouteProvider
) {
    val app = contract {
        routeProviders.forEach { it.register(this) }
        descriptionPath = "/api-docs"
    }

    fun asServer() = app.asServer(Jetty(3001))
}