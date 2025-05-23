pipeline {
    agent any
    environment {
        CONTAINER_NAME = "prikm_kurs"
        IMAGE_NAME = "squeezyfish/kurs"
        REACT_APP_DIR = "my-react-app"
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
        
        stage('Build React Application') {
            steps {
                dir("${REACT_APP_DIR}") {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
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
                sh """
                # Створюємо Dockerfile явно (без heredoc)
                echo "FROM nginx:alpine" > Dockerfile.light
                echo "COPY ${REACT_APP_DIR}/build /usr/share/nginx/html" >> Dockerfile.light
                echo "EXPOSE 80" >> Dockerfile.light
                echo 'CMD ["nginx", "-g", "daemon off;"]' >> Dockerfile.light
    
                # Перевіряємо, чи файл створений
                cat Dockerfile.light
                
                docker build --no-cache -f Dockerfile.light -t $IMAGE_NAME:latest .
                docker tag $IMAGE_NAME:latest $IMAGE_NAME:$BUILD_NUMBER
                """
            }
        }

        stage('📤 Push to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: "dockerhub_token", url: ""]) {
                    sh '''
                    docker push $IMAGE_NAME:latest
                    docker push $IMAGE_NAME:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Run container') {
            steps {
                sh '''
                docker run -d --name $CONTAINER_NAME -p 8085:80 $IMAGE_NAME:latest
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
