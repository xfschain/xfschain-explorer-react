pipeline {
    agent any
    environment {
        IMAGE_REPOSITORY = 'reg.docker.dsyun.io'
        IMAGE_NAME = 'xfschain/xfschain-explorer-react'
        CI = 'false'
        REACT_APP_API_BASE_URL = 'https://prismscan.xfs.tech/api'
     }
     options {
        gitLabConnection('gitlab')
    }
    stages {
        stage('BuildAndRelease') {
            when {
                branch 'main'
            }
            steps {
                script {
                    updateGitlabCommitStatus name: 'BuildAndRelease', state: 'pending'
                    dockerImage = docker.build("${IMAGE_REPOSITORY}/${IMAGE_NAME}",
                     "--build-arg REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} .")
                    docker.withRegistry("https://${IMAGE_REPOSITORY}",
                         "reg.docker.dsyun.io"){
                             dockerImage.push()
                        }
                }
            }
            post {
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
