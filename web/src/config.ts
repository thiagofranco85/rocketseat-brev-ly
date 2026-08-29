/**
 * Host exibido antes do caminho encurtado, como no layout do Figma.
 * `window.location.host` em vez de um valor fixo: com a API integrada, um
 * link exibido como `brev.ly/slug` mas servido de outro domínio é enganoso
 * e não é clicável de verdade. Assim o texto sempre bate com de onde o
 * frontend está sendo servido (localhost:5300 em dev, o domínio real em prod).
 */
export const SHORT_LINK_HOST = window.location.host
