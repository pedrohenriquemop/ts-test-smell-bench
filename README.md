# ts-test-smell-bench

Uma ferramenta CLI para minerar, preparar e analisar testes em TypeScript, detectando *test smells* com o auxílio de LLMs locais e externos.

## Como Usar

1. **Instale as dependências:**
   ```sh
   npm install
   ```

2. **Configuração:**
   Edite o arquivo `ts-test-smell-bench.config.json` para ajustar parâmetros de busca do GitHub, caminhos de pastas e modelos LLM.

3. **Comandos disponíveis:**
   Use o script `./bench` para orquestrar tudo.

   - **Minerar arquivos de teste do GitHub:**
     ```sh
     ./bench mine
     ```
   - **Fatiar testes em lotes para avaliação/rotulação:**
     ```sh
     ./bench prepare --sample-size 50
     ```
   - **Analisar *test smells* (via Ollama):**
     ```sh
     ./bench analyze
     ```

Para ver opções extras de cada comando, basta rodar:
```sh
./bench --help
```
