.PHONY: ssh
ssh:
	docker exec -it gymemory_web bash
prepare:
	./tools/prepare.sh
