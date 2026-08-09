(function () {
  const config = window.SUPABASE_CONFIG;
  const missingConfig = !config || !config.url || config.url.includes('YOUR_PROJECT_REF') ||
    !config.publishableKey || config.publishableKey.includes('YOUR_SUPABASE');

  if (missingConfig) {
    window.supabaseReady = Promise.reject(new Error('服務尚未設定完成，請確認 Supabase 設定。'));
    return;
  }

  window.supabaseClient = window.supabase.createClient(config.url, config.publishableKey);
  window.supabaseReady = Promise.resolve(window.supabaseClient);
}());
