pipeline {
    agent any
    environment {
        CONTAINER_NAME = "prikm_lab2"
        IMAGE_NAME = "squeezyfish/prikm"
        REACT_APP_DIR = "my-react-app"
    }
 
    stages {
        stage('Start') {
            steps {
                echo 'Lab_2: started by GitHub webhook'
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
 
        stage('Cleanup old containers') {
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
 
        stage('Image build') {
            steps {
                sh '''
                # Create a temporary Dockerfile for the React app
                cat > Dockerfile.react << EOL
                FROM nginx:alpine
                COPY ${REACT_APP_DIR}/build /usr/share/nginx/html
                EXPOSE 80
                CMD ["nginx", "-g", "daemon off;"]
                EOL

                docker build -f Dockerfile.react -t prikm:latest .
                docker tag prikm $IMAGE_NAME:latest
                docker tag prikm $IMAGE_NAME:$BUILD_NUMBER
                '''
            }
        }
 
        stage('Push to registry') {
            steps {
                withDockerRegistry([credentialsId: "dockerhub_token", url: ""]) {
                    sh '''
                    docker push $IMAGE_NAME:latest
                    docker push $IMAGE_NAME:$BUILD_NUMBER
                    '''
                }
            }
        }
 
        stage('Deploy image') {
            steps {
                sh '''
                docker run -d --name $CONTAINER_NAME -p 80:80 $IMAGE_NAME:latest
                echo "Deployment completed successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
