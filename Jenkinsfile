pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID="705252976650"
        AWS_DEFAULT_REGION="il-central-1" 
        IMAGE_REPO_NAME="todo-app"
        REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
        REGISTRY_URI = "${REGISTRY}/${IMAGE_REPO_NAME}"
        AWS_ECR_LOGIN = "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${REGISTRY_URI}"
        SSH_PEM_FILE = "/var/lib/jenkins/secrets/ec2_ssh.pem"
        EC2_USER = "ec2-user"
        EC2_DOMAIN = "51-16-134-73"
        EC2_SSH_URL = "ec2-${EC2_DOMAIN}.${AWS_DEFAULT_REGION}.compute.amazonaws.com"
        SSH_COMMAND = "ssh -i ${SSH_PEM_FILE} ${EC2_SSH_URL}"
    }
    
    stages {
        stage("Building project docker images") {
            steps {
                sh 'docker compose -f docker/production/docker-compose.yml build'
            }
        }

        stage('Logging into AWS ECR') {
            steps {
                sh "${AWS_ECR_LOGIN}"
            }
        }  

        stage("Pushing to AWS ECR") {
            steps {
                sh "docker push ${REGISTRY_URI}:app-prod"
                sh "docker push ${REGISTRY_URI}:server-prod"
                sh "docker push ${REGISTRY_URI}:db-prod"
            }
        }

        stage("Removing docker data in EC2 INSTANCE") {
            steps {
                sh "${SSH_COMMAND} docker container rm db-prod server-prod app-prod --force || true"
                sh "${SSH_COMMAND} docker image rm ${REGISTRY_URI}:app-prod ${REGISTRY_URI}:server-prod ${REGISTRY_URI}:db-prod --force || true"
            }
        }

        stage("Pulling LTS images from AWS ECR") {
            steps {
                sh "${SSH_COMMAND} ${AWS_ECR_LOGIN}"
                sh "${SSH_COMMAND} docker pull ${REGISTRY_URI}:app-prod"
                sh "${SSH_COMMAND} docker pull ${REGISTRY_URI}:server-prod"
                sh "${SSH_COMMAND} docker pull ${REGISTRY_URI}:db-prod"
            }
        }

        stage("Running docker containers in EC2 INSTANCE") {
            steps {
                sh "${SSH_COMMAND} docker-compose -f /home/${EC2_USER}/docker_compose/docker-compose.yml up -d"
            }
        }
    }
}