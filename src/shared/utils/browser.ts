/**
 * Browser utilities for handling in-app browser detection and URL resolution
 *
 * This module provides utilities to detect when the app is running inside an in-app browser
 * (like Facebook, Instagram, Twitter, etc.) and provides fallback mechanisms for getting
 * the correct domain/URL information.
 *
 * Problem: In-app browsers can sometimes return their own URL instead of the app's URL
 * when accessing window.location.host or window.location.origin. This can cause issues
 * with authentication flows, API calls, and other functionality that depends on the
 * correct domain information.
 *
 * Solution: These utilities detect in-app browsers and fall back to a configured
 * domain/URL when necessary, ensuring consistent behavior across all environments.
 *
 * Usage:
 * - Use getDomainAndUri() for SIWE authentication
 * - Use getBaseUrl() for API endpoints and asset URLs
 * - Use getCurrentUrl() for general URL needs
 * - Use isInAppBrowser() for custom logic
 */

import { siteInfo } from "./siteInfo";

/**
 * Detects if we're in an in-app browser by looking for common indicators
 */
export function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent;

  return (
    // Social media in-app browsers
    userAgent.includes("FBAN") || // Facebook
    userAgent.includes("FBAV") || // Facebook
    userAgent.includes("Instagram") || // Instagram
    userAgent.includes("Line") || // Line
    userAgent.includes("Twitter") || // Twitter/X
    userAgent.includes("Snapchat") || // Snapchat
    userAgent.includes("WhatsApp") || // WhatsApp
    userAgent.includes("Telegram") || // Telegram
    userAgent.includes("Discord") || // Discord
    // Mobile app WebViews
    userAgent.includes("wv") || // Android WebView
    userAgent.includes("WebView") || // Generic WebView
    (userAgent.includes("Mobile") && userAgent.includes("Safari") && !userAgent.includes("Chrome")) || // iOS WebView
    // Additional mobile app indicators
    userAgent.includes("CriOS") || // Chrome on iOS (often in apps)
    userAgent.includes("FxiOS") || // Firefox on iOS (often in apps)
    userAgent.includes("OPiOS") || // Opera on iOS (often in apps)
    userAgent.includes("EdgiOS")   // Edge on iOS (often in apps)=== true
  );
}

/**
 * Gets the correct domain and URI for the current environment
 * Falls back to configured domain when in in-app browsers
 */
export function getDomainAndUri() {
  if (typeof window === "undefined") {
    const configuredUrl = new URL(siteInfo.url);
    return {
      domain: configuredUrl.host,
      uri: configuredUrl.origin,
    };
  }

  // If we're in an in-app browser, use the configured domain
  if (isInAppBrowser()) {
    const configuredUrl = new URL(siteInfo.url);
    return {
      domain: configuredUrl.host,
      uri: configuredUrl.origin,
    };
  }

  // Otherwise, use the current location
  return {
    domain: window.location.host,
    uri: window.location.origin,
  };
}

/**
 * Gets the correct base URL for the current environment
 * Falls back to configured URL when in in-app browsers
 */
export function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return siteInfo.url;
  }

  // If we're in an in-app browser, use the configured URL
  if (isInAppBrowser()) {
    return siteInfo.url;
  }

  // Otherwise, use the current location
  const url = window.location.origin;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Gets the current URL with proper handling for in-app browsers
 * Useful for cases where you need the full current URL
 */
export function getCurrentUrl(): string {
  if (typeof window === "undefined") {
    return siteInfo.url;
  }

  // If we're in an in-app browser, return the configured URL
  if (isInAppBrowser()) {
    return siteInfo.url;
  }

  // Otherwise, return the current location
  return window.location.href;
}
