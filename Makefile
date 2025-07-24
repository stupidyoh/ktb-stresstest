AWS_ECR_REPO := 587169513591.dkr.ecr.ap-northeast-2.amazonaws.com
IMAGE_NAME := ktb-stresstest
IMAGE_TAG := v1.0.2


run-artillery-head:
	artillery run playwright-artillery-head.yml

build-docker:
	docker buildx build --platform linux/amd64 -t $(AWS_ECR_REPO)/$(IMAGE_NAME):$(IMAGE_TAG) .