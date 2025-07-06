---
layout: docs-i18n
title: Segurança
permalink: /pt/docs/seguranca/
lang: pt
---

# Segurança

O HelixPHP leva a segurança a sério e fornece múltiplas camadas de proteção prontas para uso. Este guia cobre os recursos de segurança disponíveis e as melhores práticas para manter sua aplicação segura.

## Visão Geral

O HelixPHP inclui proteção contra vulnerabilidades de segurança comuns:

- **CSRF** (Cross-Site Request Forgery)
- **XSS** (Cross-Site Scripting)
- **Injeção SQL**
- **Sequestro de Sessão**
- **Ataques de Força Bruta**
- **Ataques de Temporização**
- **Travessia de Diretório**

## Proteção CSRF

### Como Funciona a Proteção CSRF

O HelixPHP gera tokens únicos para cada sessão para verificar que requisições autenticadas vêm da sua aplicação:

```php
// Habilitar proteção CSRF globalmente
$app->middleware(new CsrfMiddleware());

// Em seus formulários
<form method="POST" action="/perfil">
    <?= csrf_field() ?>
    <!-- ou -->
    <input type="hidden" name="_token" value="<?= csrf_token() ?>">
    
    <!-- campos do formulário -->
</form>

// Para requisições AJAX
fetch('/api/dados', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
});
```

### Excluindo Rotas

Algumas rotas podem precisar ser excluídas da proteção CSRF:

```php
$app->middleware(new CsrfMiddleware([
    'except' => [
        '/webhooks/*',
        '/api/publico/*'
    ]
]));
```

### Verificação de Token Personalizada

```php
class CustomCsrfMiddleware extends CsrfMiddleware
{
    protected function tokensMatch($request): bool
    {
        $token = $this->getTokenFromRequest($request);
        $sessionToken = $request->session()->token();
        
        return hash_equals($sessionToken, $token);
    }
}
```

## Proteção XSS

### Escape Automático de Saída

Sempre escape a entrada do usuário ao exibi-la:

```php
// Em templates PHP
<?= e($entradaUsuario) ?>
<?= escape($comentario) ?>

// Escape para diferentes contextos
<?= e($dados, 'html') ?>      // Contexto HTML (padrão)
<?= e($dados, 'js') ?>        // Contexto JavaScript
<?= e($dados, 'css') ?>       // Contexto CSS
<?= e($dados, 'attr') ?>      // Contexto de atributo HTML
```

### Política de Segurança de Conteúdo

Defina cabeçalhos CSP para prevenir ataques XSS:

```php
$app->middleware(function($request, $handler) {
    $response = $handler->handle($request);
    
    return $response->withHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.exemplo.com; style-src 'self' 'unsafe-inline';"
    );
});
```

### Cabeçalhos de Proteção XSS

```php
class SecurityHeadersMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        
        return $response
            ->withHeader('X-XSS-Protection', '1; mode=block')
            ->withHeader('X-Content-Type-Options', 'nosniff')
            ->withHeader('X-Frame-Options', 'SAMEORIGIN')
            ->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
}
```

## Autenticação

### Hash de Senhas

Sempre faça hash de senhas usando algoritmos seguros:

```php
use Helix\Security\Hash;

// Fazer hash da senha
$senhaHash = Hash::make($request->input('senha'));

// Verificar senha
if (Hash::check($senhaSimples, $senhaHash)) {
    // Senha está correta
}

// Verificar se precisa refazer o hash
if (Hash::needsRehash($senhaHash)) {
    $senhaHash = Hash::make($senhaSimples);
    // Atualizar senha armazenada
}
```

### Exemplo de Autenticação

```php
class AuthController
{
    public function login(Request $request, Response $response)
    {
        $credenciais = $request->only(['email', 'senha']);
        
        $usuario = User::where('email', $credenciais['email'])->first();
        
        if (!$usuario || !Hash::check($credenciais['senha'], $usuario->password)) {
            return $response->unauthorized('Credenciais inválidas');
        }
        
        // Gerar token seguro
        $token = bin2hex(random_bytes(32));
        
        // Armazenar token
        $usuario->api_token = hash('sha256', $token);
        $usuario->save();
        
        return $response->json([
            'token' => $token,
            'usuario' => $usuario
        ]);
    }
}
```

### Autenticação JWT

```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuth
{
    private string $secret;
    
    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }
    
    public function generateToken(User $usuario): string
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $usuario->id,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 horas
            'usuario' => [
                'id' => $usuario->id,
                'email' => $usuario->email
            ]
        ];
        
        return JWT::encode($payload, $this->secret, 'HS256');
    }
    
    public function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
```

## Limitação de Taxa

Proteja contra ataques de força bruta e abuso de API:

```php
// Limitação de taxa global
$app->middleware(new RateLimitMiddleware([
    'max_attempts' => 60,
    'decay_minutes' => 1
]));

// Limites específicos por rota
$app->post('/login', function($req, $res) {
    // Lógica de login
})->middleware('throttle:5,1'); // 5 tentativas por minuto

// Limitação de taxa personalizada
class CustomRateLimiter extends RateLimitMiddleware
{
    protected function resolveRequestSignature($request): string
    {
        // Usar ID do usuário se autenticado, senão IP
        if ($usuario = $request->getAttribute('usuario')) {
            return 'usuario:' . $usuario->id;
        }
        
        return 'ip:' . $request->getServerParams()['REMOTE_ADDR'];
    }
}
```

## Prevenção de Injeção SQL

### Use Vinculação de Parâmetros

Sempre use vinculação de parâmetros para consultas de banco de dados:

```php
// Usando query builder (seguro)
$usuarios = DB::table('usuarios')
    ->where('email', $email)
    ->where('ativo', true)
    ->get();

// Usando consultas brutas com vinculação (seguro)
$usuarios = DB::select(
    'SELECT * FROM usuarios WHERE email = ? AND ativo = ?',
    [$email, true]
);

// NUNCA faça isso (vulnerável)
$usuarios = DB::select("SELECT * FROM usuarios WHERE email = '$email'");
```

### Validação de Entrada

```php
$validator = validate($request->all(), [
    'email' => 'required|email|max:255',
    'idade' => 'required|integer|between:18,100',
    'papel' => 'required|in:admin,usuario,convidado'
]);

if ($validator->fails()) {
    return $response->unprocessable($validator->errors());
}
```

## Segurança de Sessão

### Configurar Sessões Seguras

```php
// Na sua configuração de sessão
return [
    'driver' => 'file',
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => true,
    'secure' => true,  // Apenas HTTPS
    'httponly' => true, // Sem acesso JavaScript
    'same_site' => 'lax',
    'partitioned' => true
];
```

### Prevenção de Fixação de Sessão

```php
class SessionSecurityMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        // Regenerar ID de sessão no login
        if ($request->getUri()->getPath() === '/login' && $request->isPost()) {
            session_regenerate_id(true);
        }
        
        // Verificar sequestro de sessão
        $sessaoIp = $_SESSION['ip_address'] ?? null;
        $ipAtual = $request->getServerParams()['REMOTE_ADDR'];
        
        if ($sessaoIp && $sessaoIp !== $ipAtual) {
            session_destroy();
            return response()->unauthorized('Sessão inválida');
        }
        
        $_SESSION['ip_address'] = $ipAtual;
        
        return $handler->handle($request);
    }
}
```

## Segurança de Upload de Arquivos

### Validar Uploads de Arquivo

```php
class FileUploadController
{
    public function upload(Request $request, Response $response)
    {
        $validator = validate($request->all(), [
            'arquivo' => 'required|file|mimes:jpg,png,pdf|max:2048'
        ]);
        
        if ($validator->fails()) {
            return $response->unprocessable($validator->errors());
        }
        
        $arquivo = $request->file('arquivo');
        
        // Validação adicional
        if (!$this->isValidFile($arquivo)) {
            return $response->badRequest('Arquivo inválido');
        }
        
        // Gerar nome de arquivo seguro
        $nomeArquivo = $this->generateSafeFilename($arquivo);
        
        // Armazenar fora da raiz web
        $caminho = storage_path('uploads/' . $nomeArquivo);
        $arquivo->moveTo($caminho);
        
        return $response->json(['caminho' => $nomeArquivo]);
    }
    
    private function isValidFile($arquivo): bool
    {
        // Verificar tipo MIME real
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $arquivo->getStream()->getMetadata('uri'));
        finfo_close($finfo);
        
        $tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];
        
        return in_array($mimeType, $tiposPermitidos);
    }
    
    private function generateSafeFilename($arquivo): string
    {
        $extensao = pathinfo($arquivo->getClientFilename(), PATHINFO_EXTENSION);
        return uniqid() . '_' . time() . '.' . $extensao;
    }
}
```

## Criptografia

### Criptografia de Dados

```php
use Helix\Security\Encryption;

// Criptografar dados
$criptografado = Encryption::encrypt($dadosSensiveis);

// Descriptografar dados
$descriptografado = Encryption::decrypt($criptografado);

// Criptografar com chave personalizada
$criptografado = Encryption::encrypt($dados, $chavePersonalizada);
```

### Configuração

```php
// No seu arquivo .env
APP_KEY=base64:sua-string-aleatoria-de-32-caracteres-aqui
CIPHER=AES-256-CBC
```

## Cabeçalhos de Segurança

### Cabeçalhos de Segurança Abrangentes

```php
class SecurityHeadersMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        
        return $response
            // Prevenir XSS
            ->withHeader('X-XSS-Protection', '1; mode=block')
            
            // Prevenir MIME sniffing
            ->withHeader('X-Content-Type-Options', 'nosniff')
            
            // Prevenir clickjacking
            ->withHeader('X-Frame-Options', 'DENY')
            
            // Forçar HTTPS
            ->withHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
            
            // Controlar informação de referência
            ->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            
            // Política de recursos
            ->withHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
            
            // Política de Segurança de Conteúdo
            ->withHeader('Content-Security-Policy', $this->getCspPolicy());
    }
    
    private function getCspPolicy(): string
    {
        return implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ]);
    }
}
```

## Segurança de API

### Autenticação de API

```php
class ApiAuthMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        $apiKey = $request->getHeaderLine('X-API-Key');
        
        if (!$apiKey) {
            return response()->unauthorized('Chave API necessária');
        }
        
        // Comparação de tempo constante para prevenir ataques de temporização
        $chaveValida = hash('sha256', $_ENV['API_KEY']);
        $chaveFornecida = hash('sha256', $apiKey);
        
        if (!hash_equals($chaveValida, $chaveFornecida)) {
            return response()->unauthorized('Chave API inválida');
        }
        
        return $handler->handle($request);
    }
}
```

### Configuração CORS

```php
$app->middleware(new CorsMiddleware([
    'allowed_origins' => ['https://app.exemplo.com'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-API-Key'],
    'exposed_headers' => ['X-RateLimit-Remaining'],
    'max_age' => 86400,
    'credentials' => true
]));
```

## Melhores Práticas de Segurança

1. **Mantenha o HelixPHP Atualizado**: Atualize regularmente para obter patches de segurança
2. **Use HTTPS**: Sempre use SSL/TLS em produção
3. **Valide Toda Entrada**: Nunca confie na entrada do usuário
4. **Princípio do Menor Privilégio**: Dê permissões mínimas necessárias
5. **Auditorias de Segurança**: Audite regularmente seu código e dependências
6. **Tratamento de Erros**: Nunca exponha informações sensíveis em mensagens de erro
7. **Logging**: Registre eventos de segurança para monitoramento
8. **Variáveis de Ambiente**: Armazene configuração sensível em variáveis de ambiente
9. **Dependências**: Mantenha todas as dependências atualizadas
10. **Sanitização de Entrada**: Sanitize dados antes do armazenamento e escape antes da saída

## Checklist de Segurança

- [ ] Proteção CSRF habilitada
- [ ] Cabeçalhos de proteção XSS configurados
- [ ] Toda entrada do usuário validada
- [ ] Senhas com hash usando bcrypt
- [ ] HTTPS forçado em produção
- [ ] Cabeçalhos de segurança configurados
- [ ] Limitação de taxa implementada
- [ ] Uploads de arquivo validados
- [ ] Injeção SQL prevenida
- [ ] Sessões configuradas com segurança
- [ ] Autenticação de API implementada
- [ ] Mensagens de erro não vazam informações
- [ ] Dependências atualizadas regularmente
- [ ] Log de segurança habilitado