if (process.env.CI) {
  console.log('CI-CD detected husky is not installed');
  process.exit(0);
}

(await import('husky')).install('./config/husky');
