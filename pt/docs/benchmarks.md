---
redirect_from:
  - /docs/benchmarks/
  - /en/docs/benchmarks/
  - /en/benchmarks/
layout: docs-benchmarks
title: Benchmarks de Performance
description: Benchmark Docker reproduzível da API de votação, PivotPHP 4.0 vs. outros frameworks
lang: pt
---

Esta página resume o benchmark oficial do PivotPHP, mantido em
[`pivotphp/benchmarks`](https://github.com/PivotPHP/pivotphp-benchmarks). Todos os frameworks
executam **a mesma API de votação**, cada um em sua própria stack Docker isolada com recursos
idênticos e limitados. Os números abaixo são os do relatório de **2026-10-10** (PivotPHP 4.0).

## Metodologia

- **Mesma API** em todos os frameworks: health check, listagem/detalhe de candidatos (cache Redis →
  banco), registro de voto (valida CPF, voto duplicado → `409`, candidato inexistente → `404`, entrada
  inválida → `422`, transação + invalidação de cache) e resultados agregados (`COUNT`/`GROUP BY`).
- **Isolamento**: cada framework sobe sua própria stack (banco + cache próprios); um framework é
  medido por vez.
- **Carga** via [k6](https://k6.io/). Dois cenários: `vote-moderate` (100 VUs fixos, sem saturação)
  e `vote-load` (rampa 10→800 VUs, saturação proposital).
- **Correção validada por smoke test** antes de cada cenário (taxa de erro ~0%).

### Ambiente

| Item | Valor |
|---|---|
| Host | WSL2, Linux 6.18, 5 cores, 19 GB RAM |
| Docker | 29.7.2 · Compose v5.5.0 |
| App | 1 CPU / 512 MB (limite via `deploy.resources`) |
| PostgreSQL | 17 · 2 CPU / 2 GB |
| Redis | 7 · 0,5 CPU / 256 MB |
| Pool FPM | `pm.max_children=32` (igual entre os frameworks PHP-FPM) |
| Webman | Worker assíncrono (Workerman), 4 workers |
| PHP | 8.3 (JIT desligado) |

## Resultados — `vote-moderate` (100 VUs)

| Framework | Throughput (req/s) | p95 | Checks OK |
|---|---|---|---|
| **PivotPHP 4.0** | **229,72** | **209,69 ms** | 99,96% |
| Slim 4 | 227,78 | 212,46 ms | 99,95% |
| Mezzio | 229,05 | 211,75 ms | 99,97% |
| Symfony (microkernel) | 220,22 | 224,97 ms | 99,95% |
| Webman (async) | 1.159,45 | 49,28 ms | 99,99% |

Sem saturação, os frameworks PHP-FPM empatam de verdade (p95 entre ~210 e ~225 ms). O PivotPHP 4.0
fica no topo do grupo, com o menor p95 ao lado do Mezzio.

## Resultados — `vote-load` (10→800 VUs)

| Framework | Throughput (req/s) | p95 (voto) | p99 (voto) | Checks OK |
|---|---|---|---|---|
| **PivotPHP 4.0** | 164,97 | 3,00 s | 3,27 s | 99,98% |
| Slim 4 | 166,00 | 2,92 s | 3,34 s | 99,98% |
| Mezzio | 162,56 | 3,07 s | 3,94 s | 99,98% |
| Symfony (microkernel) | 167,64 | 2,79 s | 3,12 s | 99,98% |
| Webman (async) | 493,62 | 441,52 ms | 657,42 ms | 99,99% |

Aqui a rampa ultrapassa a capacidade de 1 núcleo + 32 workers: o p95 alto reflete **fila** no
PHP-FPM, não diferença de framework. Todos os PHP-FPM ficam na mesma faixa (~163–168 req/s).

## Análise

1. **Correção idêntica**: todos retornam ~0% de erro e ~99,98% de checks OK — mesmo contrato, mesmo
   SQL, mesma validação de CPF e mesmo cache Redis.
2. **PHP-FPM empatam**: PivotPHP, Slim, Mezzio e Symfony ficam dentro de ~2% uns dos outros — dentro
   do ruído de medição.
3. **Webman (assíncrono) domina**: workers persistentes, sem a fila do PHP-FPM. É um runtime
   diferente — a comparação não é maçãs-com-maçãs.
4. **Saturação é só fila**: no cenário `moderate`, a latência do PivotPHP cai de ~3 s (fila) para
   ~210 ms.

## Ressalvas

- **Uma execução por framework** (sem mediana de múltiplas rodadas).
- **`vote-load` satura de propósito** (rampa até 800 VUs).
- **Webman usa 4 workers assíncronos** — runtime diferente dos frameworks PHP-FPM.
- **WSL2** distorce I/O e CPU.
- **Redis** cacheia candidatos/resultados, o que beneficia leituras.

## Reproduzindo

```bash
git clone https://github.com/PivotPHP/pivotphp-benchmarks
cd pivotphp-benchmarks

# Todos os frameworks, cenário vote-load
./scripts/run-benchmark.sh

# Apenas o PivotPHP, cenário moderado
./scripts/run-benchmark.sh pivotphp moderate
```

Os resultados brutos (saída completa do k6) ficam em `reports/` e `results/` no repositório. Não
confiamos em números de benchmark sem a metodologia acima; se um número não estiver neste relatório,
trate-o como não verificado.
