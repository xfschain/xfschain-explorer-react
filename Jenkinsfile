pipeline {
    agent any
    environment {
        IMAGE_REPOSITORY = 'reg.docker.dsyun.io'
        IMAGE_NAME = 'xfschain/xfschain-explorer-react'
        CI = 'false'
        REACT_APP_API_BASE_URL = 'https://api.xfschain.test.dsyun.io'
        REACT_APP_WEBSOCKET_BASE_URL = 'wss://api.xfschain.test.dsyun.io'
     }
     options {
        gitLabConnection('gitlab')
    }
    stages {
        stage('BuildAndRelease') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    updateGitlabCommitStatus name: 'BuildAndRelease', state: 'pending'
                    dockerImage = docker.build("${IMAGE_REPOSITORY}/${IMAGE_NAME}",
                     "--build-arg REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} --build-arg REACT_APP_WEBSOCKET_BASE_URL=${REACT_APP_WEBSOCKET_BASE_URL} .")
                    docker.withRegistry("https://${IMAGE_REPOSITORY}",
                         "${env.DEFAULT_DOCKER_REPOSITORY_CREDENTIAL}"){
                             dockerImage.push()
                        }
                }
            }
            pose {
                success {
                    updateGitlabCommitStatus name: 'BuildAndRelease', state: 'success'
                }
                failure {
                    updateGitlabCommitStatus name: 'BuildAndRelease', state: 'failed'
                }
            }
        }
    }
}
