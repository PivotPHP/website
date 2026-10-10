---
layout: docs
title: Extensão Cycle ORM (pausada)
permalink: /pt/docs/extensions/cycle-orm/
lang: pt
---

> ⏸️ **Pausada em 2026-10-10.** O pacote [`pivotphp/cycle-orm`](https://github.com/PivotPHP/pivotphp-cycle-orm)
> tem como alvo o **PivotPHP Core 1.x** e **ainda não foi migrado para o 4.x** — ele usa
> `PivotPHP\Core\Http\Request`/`Response`, removidos na 4.0. O pacote **não está abandonado**: a
> migração para o core 4.0 está registrada no
> [SPEC-103](https://github.com/PivotPHP/pivotphp-specs/blob/main/SPECS/SPEC-103-archive-cycle-orm.md)
> e o repositório será atualizado quando esse trabalho for priorizado.

## O que isso significa

- **Não use `pivotphp/cycle-orm` com o core 4.x.** A integração é incompatível com a camada HTTP da
  4.0.
- **A versão atual do pacote (1.0.1)** funciona apenas com o core 1.x.
- Nenhuma API de Cycle ORM é documentada aqui como disponível para o 4.x, porque não há integração
  compatível no momento.

## Alternativas no core 4.x

O `pivotphp/core` inclui uma conexão PDO simples, `PivotPHP\Core\Database\Database` (drivers
`sqlite`, `mysql`/`mariadb`, `pgsql`/`postgres`), com prepared statements e transações. Veja
[Banco de Dados]({{ '/pt/docs/database/' | relative_url }}).

Para uma camada de ORM no 4.x, use uma biblioteca independente (por exemplo, o Cycle ORM puro com a
sua própria configuração, ou outro ORM de sua preferência) apoiada nessa conexão.

## Acompanhando

- Repositório: [github.com/PivotPHP/pivotphp-cycle-orm](https://github.com/PivotPHP/pivotphp-cycle-orm)
- Migração para o core 4.x: [SPEC-103](https://github.com/PivotPHP/pivotphp-specs/blob/main/SPECS/SPEC-103-archive-cycle-orm.md)
