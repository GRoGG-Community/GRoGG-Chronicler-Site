package cat.grogg.empire

import cat.grogg.RouteProvider
import org.http4k.contract.ContractBuilder
import org.http4k.contract.bindContract
import org.http4k.contract.div
import org.http4k.core.Body
import org.http4k.core.HttpHandler
import org.http4k.core.Method.*
import org.http4k.core.Response
import org.http4k.core.Status
import org.http4k.core.with
import org.http4k.format.Moshi.auto
import org.http4k.lens.Path
import org.http4k.lens.int

class EmpireController(private val empireRepository: EmpireRepository): RouteProvider {
    private val empirePostLens = Body.auto<EmpirePost>().toLens()
    private val empireLens = Body.auto<Empire>().toLens()
    private val empireListLens = Body.auto<List<Empire>>().toLens()

    fun getAll(): HttpHandler = {
        Response(Status.OK).with(empireListLens of empireRepository.getAll())
    }

    fun getById(id: Int): HttpHandler = {
        empireRepository.getById(id)?.let {
            Response(Status.OK).with(empireLens of it)
        } ?: Response(Status.NOT_FOUND)
    }

    fun deleteById(id: Int): HttpHandler = {
        val status = if (empireRepository.deleteById(id)) Status.OK else Status.NOT_FOUND
        Response(status)
    }

    override fun register(contract: ContractBuilder) {
        contract.apply {
            routes += "/empires" bindContract GET to ::getAll
            routes += "/empires" / Path.int().of("empireId") bindContract GET to ::getById
            routes += "/empires" / Path.int().of("empireId") bindContract DELETE to ::deleteById
            routes += "/empires" bindContract POST to { request ->
                val empirePost = empirePostLens(request)
                val savedEmpire = empireRepository.save(empirePost.toEmpire())
                Response(Status.CREATED).with(empireLens of savedEmpire)
            }
        }
    }
}