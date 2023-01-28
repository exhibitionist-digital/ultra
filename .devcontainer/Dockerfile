# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

ENV DENO_INSTALL=/deno
ENV DENO_VERSION=v1.29.0

RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh | sh -s ${DENO_VERSION} \
    && chown -R vscode /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

RUN echo "deb http://packages.azlux.fr/debian/ buster main" | sudo tee /etc/apt/sources.list.d/azlux.list \
    && wget -qO - https://azlux.fr/repo.gpg.key | sudo apt-key add - \
    && apt update \
    && apt install oha

RUN sudo apt-get clean

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get -y install --no-install-recommends <your-package-list-here>
