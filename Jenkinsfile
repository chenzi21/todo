pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID="705252976650"
        AWS_DEFAULT_REGION="il-central-1" 
        IMAGE_REPO_NAME="todo-app"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
        AWS_ECR_LOGIN = "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${REPOSITORY_URI}"
        SSH_PEM_FILE = "/var/lib/jenkins/secrets/ec2_ssh.pem"
        EC2_USER = "ec2-user"
        EC2_DOMAIN = "51-16-134-73"
        EC2_SSH_URL = "${EC2_USER}@ec2-${EC2_DOMAIN}.${AWS_DEFAULT_REGION}.compute.amazonaws.com"
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
                sh "docker push ${REPOSITORY_URI}:app-prod"
                sh "docker push ${REPOSITORY_URI}:server-prod"
                sh "docker push ${REPOSITORY_URI}:db-prod"
            }
        }

        stage("Removing docker data in EC2 INSTANCE") {
            steps {
                sh "${SSH_COMMAND} docker container rm db-prod server-prod app-prod --force || true"
                sh "${SSH_COMMAND} docker image rm ${REPOSITORY_URI}:app-prod ${REPOSITORY_URI}:server-prod ${REPOSITORY_URI}:db-prod --force || true"
            }
        }

         stage("Pulling LTS images from AWS ECR") {
            steps {
                sh "${SSH_COMMAND} ${AWS_ECR_LOGIN} && docker pull ${REPOSITORY_URI}:app-prod"
                sh "${SSH_COMMAND} ${AWS_ECR_LOGIN} && docker pull ${REPOSITORY_URI}:server-prod"
                sh "${SSH_COMMAND} ${AWS_ECR_LOGIN} && docker pull ${REPOSITORY_URI}:db-prod"
            }
        }

        stage("Running docker containers in EC2 INSTANCE") {
            steps {
                sh "${SSH_COMMAND} docker-compose -f /home/${EC2_USER}/docker_compose/docker-compose.yml up -d"
            }
        }
    }
}