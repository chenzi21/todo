pipeline {
    agent any
    
    stages {
        stage("build docker images") {
            steps {
                docker compose -f docker/production/docker-compose.yml build
            }
        }
    }
}