/**
 * Version Routing - Alterna entre versões mantendo idioma e página
 */

(function(window, document) {
  'use strict';

  window.VersionRoutes = {
    versions: null,
    baseUrl: '',

    init: function() {
      this.baseUrl = document.querySelector('meta[name="base-url"]')?.content || '';

      // Parse versions from window or fetch from data
      try {
        const dataElement = document.getElementById('versions-data');
        if (dataElement) {
          this.versions = JSON.parse(dataElement.textContent);
        }
      } catch (e) {
        console.warn('Could not parse versions data:', e);
      }
    },

    /**
     * Detecta versão atual da URL
     * @returns {string} Número da versão (ex: "1.2.0") ou null
     */
    getCurrentVersion: function() {
      const path = window.location.pathname;
      console.log('[VersionRoutes] getCurrentVersion - pathname:', path);

      // Remove baseUrl do início se presente
      let relativePath = path;
      if (this.baseUrl && path.startsWith(this.baseUrl)) {
        relativePath = path.substring(this.baseUrl.length);
        console.log('[VersionRoutes] After removing baseUrl:', relativePath);
      }

      // Procura por /v1/, /v2/ na URL
      const versionMatch = relativePath.match(/\/v(\d+)\//);
      console.log('[VersionRoutes] versionMatch:', versionMatch);

      if (versionMatch) {
        const majorVersion = versionMatch[1];
        console.log('[VersionRoutes] majorVersion detected:', majorVersion);
        // Map major version to full version
        const fullVersionObj = this.getFullVersionFromMajor(majorVersion);
        console.log('[VersionRoutes] fullVersionObj:', fullVersionObj);
        return fullVersionObj ? fullVersionObj.number : null;
      }

      console.log('[VersionRoutes] No version match found in URL');
      return null;
    },

    /**
     * Mapeia versão major para versão full
     * @param {string} major - Major version (1, 2, etc)
     * @returns {string} Full version (1.2.0, 2.0.0, etc) ou null
     */
    getFullVersionFromMajor: function(major) {
      if (!this.versions || !Array.isArray(this.versions)) return null;

      return this.versions.find(v => v.number.startsWith(major + '.')) || null;
    },

    /**
     * Obtém versão canônica
     * @returns {object} Versão com is_canonical: true ou null
     */
    getCanonicalVersion: function() {
      if (!this.versions || !Array.isArray(this.versions)) return null;
      return this.versions.find(v => v.is_canonical) || null;
    },

    /**
     * Converte URL entre versões
     * Mantém: idioma, página, fragmento
     *
     * @param {string} fromVersion - Versão origem (ex: "1.2.0")
     * @param {string} toVersion - Versão destino (ex: "2.0.0")
     * @param {string} currentPath - Caminho atual (default: window.location.pathname)
     * @returns {string} Novo caminho com versão atualizada
     */
    convertVersion: function(fromVersion, toVersion, currentPath) {
      currentPath = currentPath || window.location.pathname;
      console.log('[VersionRoutes] convertVersion - from:', fromVersion, 'to:', toVersion, 'currentPath:', currentPath);

      // Remove baseUrl se presente
      let relativePath = currentPath;
      if (this.baseUrl && currentPath.startsWith(this.baseUrl)) {
        relativePath = currentPath.substring(this.baseUrl.length);
      }
      console.log('[VersionRoutes] relativePath:', relativePath);

      // Encontra versões
      const fromVer = this.versions.find(v => v.number === fromVersion);
      const toVer = this.versions.find(v => v.number === toVersion);

      console.log('[VersionRoutes] fromVer:', fromVer);
      console.log('[VersionRoutes] toVer:', toVer);

      if (!fromVer || !toVer) {
        console.warn('[VersionRoutes] Invalid version', fromVersion, toVersion);
        return currentPath;
      }

      // Extrai a página específica removendo o docs_path
      let pagePath = relativePath;

      // Remove o caminho da versão origem
      if (fromVer.docs_path) {
        const docsPathNormalized = fromVer.docs_path.replace(/\/$/, '');
        console.log('[VersionRoutes] docsPathNormalized:', docsPathNormalized);
        if (relativePath.startsWith(docsPathNormalized)) {
          pagePath = relativePath.substring(docsPathNormalized.length);
          if (!pagePath) pagePath = '/';
        }
      }
      console.log('[VersionRoutes] extracted pagePath:', pagePath);

      // Reconstrói com versão destino
      let newPath = toVer.docs_path;
      if (pagePath !== '/' && !newPath.endsWith('/')) {
        newPath += pagePath;
      } else if (pagePath !== '/') {
        newPath += pagePath;
      }
      console.log('[VersionRoutes] newPath before baseUrl:', newPath);

      // Adiciona baseUrl de volta
      if (this.baseUrl) {
        newPath = this.baseUrl + newPath;
      }

      console.log('[VersionRoutes] final newPath:', newPath);
      return newPath;
    },

    /**
     * Alterna para nova versão usando a versão atual conhecida do select
     * @param {string} toVersion - Versão destino
     * @param {string} fromVersion - Versão origem (passada do template Jekyll)
     */
    switchVersionBySelect: function(toVersion, fromVersion) {
      console.log('[VersionRoutes] switchVersionBySelect called - from:', fromVersion, 'to:', toVersion);

      if (!fromVersion) {
        console.warn('[VersionRoutes] fromVersion not provided, trying to detect');
        fromVersion = this.getCurrentVersion();
      }

      if (!fromVersion) {
        console.warn('[VersionRoutes] Could not detect fromVersion, using first available version as fallback');
        if (this.versions && this.versions.length > 0) {
          fromVersion = this.versions[0].number;
        } else {
          console.error('[VersionRoutes] No versions available');
          return;
        }
      }

      console.log('[VersionRoutes] Using fromVersion:', fromVersion);
      const newPath = this.convertVersion(fromVersion, toVersion);
      console.log('[VersionRoutes] Navigating to:', newPath);
      window.location.href = newPath;
    },

    /**
     * Alterna para nova versão
     * @param {string} toVersion - Versão destino
     */
    switchVersion: function(toVersion) {
      console.log('[VersionRoutes] switchVersion called with:', toVersion);
      const currentVersion = this.getCurrentVersion();
      console.log('[VersionRoutes] currentVersion detected:', currentVersion);

      if (!currentVersion) {
        console.warn('[VersionRoutes] Could not detect current version from URL:', window.location.pathname);
        console.warn('[VersionRoutes] Available versions:', this.versions);
        // Fallback: try to use any available version and switch to the new one
        if (this.versions && this.versions.length > 0) {
          const firstVersion = this.versions[0].number;
          console.log('[VersionRoutes] Using fallback version:', firstVersion);
          const newPath = this.convertVersion(firstVersion, toVersion);
          window.location.href = newPath;
          return;
        }
        return;
      }

      const newPath = this.convertVersion(currentVersion, toVersion);
      console.log('[VersionRoutes] Navigating to:', newPath);
      window.location.href = newPath;
    }
  };

  // Inicializa imediatamente (não espera DOMContentLoaded)
  window.VersionRoutes.init();

  // Exponha globalmente
  window.switchVersion = function(version) {
    window.VersionRoutes.switchVersion(version);
  };

})(window, document);
