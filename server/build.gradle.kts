plugins {
    kotlin("jvm") version "2.1.21"
    idea
}

group = "cat.grogg"

version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(21)
}

idea {
    module {
        isDownloadJavadoc = true
        isDownloadSources = true
    }
}

val logbackVersion = "1.5.18"

dependencies {
    // Http 4k
    implementation(platform("org.http4k:http4k-bom:6.15.1.0"))

    implementation("org.http4k:http4k-core")
    implementation("org.http4k:http4k-server-jetty")
    implementation("org.http4k:http4k-client-apache")
    implementation("org.http4k:http4k-format-moshi")
    implementation("org.http4k:http4k-config")
    implementation("org.http4k:http4k-api-openapi")

    // Database
    implementation("org.xerial:sqlite-jdbc:3.50.3.0")
    implementation("org.flywaydb:flyway-core:11.10.4")

    // Logging
    implementation("io.github.oshai:kotlin-logging-jvm:7.0.3")

    implementation("org.slf4j:slf4j-api:2.0.17")
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    implementation("ch.qos.logback:logback-core:$logbackVersion")

    testImplementation(platform("io.kotest:kotest-bom:5.9.1"))
    testImplementation("io.kotest:kotest-runner-junit5")
    testImplementation("io.kotest:kotest-assertions-core")
}

tasks.withType<Test>().configureEach {
    useJUnitPlatform()
}