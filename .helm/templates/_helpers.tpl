{{/*
Create a global name for the chart to use and parse with other naming functions
*/}}
{{- define "dsdlc.v1.chart.fullname" -}}
{{- include "common.names.fullname" . -}}
{{- end -}}

{{- define "dsdlc.v1.configMap.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.configMap.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.django.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.api.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.celery.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.worker.name | trunc 56 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.migrationJob.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.api.migrationJobName | trunc 58 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.nginx.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.reverseProxy.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.ingressApi.fullname" -}}
{{- printf "%s-%s-api" (include "dsdlc.v1.chart.fullname" .) .Values.ingress.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.ingressFrontend.fullname" -}}
{{- printf "%s-%s-frontend" (include "dsdlc.v1.chart.fullname" .) .Values.ingress.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.tlsSecretApi.fullname" -}}
{{- printf "%s-%s-api" (include "dsdlc.v1.chart.fullname" .) .Values.ingress.tls.secretName | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.tlsSecretFrontend.fullname" -}}
{{- printf "%s-%s-frontend" (include "dsdlc.v1.chart.fullname" .) .Values.ingress.tls.secretName | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.tlsSecretGatewayApi.fullname" -}}
{{- printf "%s-%s-api" (include "dsdlc.v1.chart.fullname" .) "tls" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.tlsSecretGatewayFrontend.fullname" -}}
{{- printf "%s-%s-frontend" (include "dsdlc.v1.chart.fullname" .) "tls" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.secret.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.secrets.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.secretFiles.fullname" -}}
{{- printf "%s-%s" (include "dsdlc.v1.chart.fullname" .) .Values.secrets.nameFile | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dsdlc.v1.redisHostPort" -}}
{{- if .Values.redisConnection.host -}}
{{- .Values.redisConnection.host -}}:{{- .Values.redisConnection.port -}}
{{- else if .Values.dependencies.haRedis -}}
{{ template "redis-ha.fullname" (index .Subcharts "redis-ha") }}-haproxy
{{- else -}}
redis-service:6379
{{- end }}
{{- end -}}

{{- define "dsdlc.v1.postgresHostPort" -}}
{{- if .Values.databaseConnection.host -}}
{{- .Values.databaseConnection.host -}}:{{- .Values.databaseConnection.port -}}
{{- else -}}
{{- $pgFullname := printf "%s-%s" .Release.Name "postgresql" | trunc 63 | trimSuffix "-" -}}
{{- $pgFullname -}}:{{- .Values.databaseConnection.port -}}
{{- end }}
{{- end -}}

{{- define "dsdlc.v1.ingressProto" -}}
{{- if or (and .Values.ingress.enabled .Values.ingress.tls.enabled) (and .Values.gatewayApi.enabled .Values.gatewayApi.tls.enabled) -}}https{{- else -}}http{{- end -}}
{{- end -}}

{{- define "dsdlc.v1.mainFrontendHostname" -}}
{{- if .Values.ingress.enabled -}}{{ first .Values.ingress.frontendHostnames }}{{- else -}}{{ first .Values.gatewayApi.frontendHostnames }}{{- end -}}
{{- end -}}

{{- define "dsdlc.v1.commonVolumeConfig" -}}
-   name: secret-files
    secret:
        secretName: {{ include "dsdlc.v1.secretFiles.fullname" . }}
-   name: secrets
    projected:
        sources:
            -   secret:
                    name: {{ include "dsdlc.v1.secret.fullname" . }}
-   name: config
    configMap:
        name: {{ include "dsdlc.v1.configMap.fullname" . }}
{{- end -}}

{{- define "dsdlc.v1.commonVolumeMounts" -}}
-   mountPath: /home/app/secret-files
    name: secret-files
    readOnly: true
-   mountPath: /home/app/secrets
    name: secrets
    readOnly: true
-   mountPath: /home/app/config
    name: config
    readOnly: true
{{- end -}}

{{- define "dsdlc.v1.gatewayHttpRef" -}}
{{- $root := .root -}}
{{- $searchHost := .host -}}
{{- if $root.Values.gatewayApi.gateway.enabled -}}
{{- range $index, $host := (concat $root.Values.gatewayApi.frontendHostnames $root.Values.gatewayApi.apiHostnames $root.Values.gatewayApi.extraFrontendTlsHostnames $root.Values.gatewayApi.extraApiTlsHostnames) -}}
{{ if eq $host $searchHost }}
- name: gateway
  sectionName: http-{{ $index }}
{{- end -}}
{{- end -}}
{{- else -}}
{{- (index $root.Values.gatewayApi.gatewayRef.http $searchHost ) | toYaml -}}
{{- end -}}
{{- end -}}

{{- define "dsdlc.v1.gatewayHttpsRef" -}}
{{- $root := .root -}}
{{- $searchHost := .host -}}
{{- if $root.Values.gatewayApi.gateway.enabled -}}
    {{- if $root.Values.gatewayApi.tls.enabled -}}
        {{- range $index, $host := (concat $root.Values.gatewayApi.frontendHostnames $root.Values.gatewayApi.extraFrontendTlsHostnames) -}}
            {{ if eq $host $searchHost }}
- name: gateway
  sectionName: https-frontend-{{ $index }}
            {{- end -}}
        {{- end -}}
        {{- range $index, $host := (concat $root.Values.gatewayApi.apiHostnames $root.Values.gatewayApi.extraApiTlsHostnames) -}}
            {{ if eq $host $searchHost }}
- name: gateway
  sectionName: https-api-{{ $index }}
            {{- end -}}
        {{- end -}}
    {{- else -}}
{{- include "dsdlc.v1.gatewayHttpRef" . }}
    {{- end -}}
{{- else -}}
{{- if $root.Values.gatewayApi.tls.enabled -}}
{{- (index $root.Values.gatewayApi.gatewayRef.https $searchHost ) | toYaml -}}
{{- else -}}
{{- (index $root.Values.gatewayApi.gatewayRef.http $searchHost ) | toYaml -}}
{{- end -}}
{{- end -}}
{{- end -}}
