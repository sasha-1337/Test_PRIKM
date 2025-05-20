pipeline {
    agent any
    environment {
        CONTAINER_NAME = "prikm_kurs"
        LOCAL_IMAGE = "prikm:latest"
        DOCKERHUB_IMAGE = "squeezyfish/kurs:latest"
    }

    stages {
        stage('Start') {
            steps {
                echo '🚀 Fast deploy of single index.html'
            }
        }

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup old container') {
            steps {
                sh '''
                if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
                    echo "Stopping and removing existing container: $CONTAINER_NAME"
                    docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME
                else
                    echo "No existing container found, skipping cleanup."
                fi
                '''
            }
        }

        stage('Build lightweight image') {
            steps {
                sh '''
                cat > Dockerfile.light <<EOL
                FROM nginx:alpine
                COPY public/index.html /usr/share/nginx/html/index.html
                EXPOSE 80
                CMD ["nginx", "-g", "daemon off;"]
                EOL

                docker build -f Dockerfile.light -t $IMAGE_NAME:latest .
                docker tag $LOCAL_IMAGE $DOCKERHUB_IMAGE
                '''
            }
        }

        stage('📤 Push to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub_token', url: '']) {
                    sh 'docker push $DOCKERHUB_IMAGE'
                }
            }
        }

        stage('Run container') {
            steps {
                sh '''
                docker run -d --name $CONTAINER_NAME -p 8085:80 $DOCKERHUB_IMAGE
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Lightweight index.html deployed!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
