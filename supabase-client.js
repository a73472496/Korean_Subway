(function () {
  const config = window.SUPABASE_CONFIG;
  const missingConfig = !config || !config.url || config.url.includes('YOUR_PROJECT_REF') ||
    !config.publishableKey || config.publishableKey.includes('YOUR_SUPABASE');

  if (missingConfig) {
    window.supabaseReady = Promise.reject(new Error('Supabase 尚未設定。請更新 supabase-config.js。'));
    return;
  }

  window.supabaseClient = window.supabase.createClient(config.url, config.publishableKey);
  window.supabaseReady = Promise.resolve(window.supabaseClient);
}());
