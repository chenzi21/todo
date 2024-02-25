pipeline {
    agent any
    
    stages {
        stage("build docker images") {
            steps {
                sh 'docker compose -f docker/production/docker-compose.yml build'
            }
        }
    }
}