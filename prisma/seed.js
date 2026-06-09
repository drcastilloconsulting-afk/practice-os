const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://drcas@localhost:5432/practice_os';
const pool = new Pool({ connectionString });

async function seed() {
  console.log('Seeding local database...');
  const client = await pool.connect();
  
  try {
    // 1. Clean existing records
    console.log('Cleaning existing records...');
    await client.query('TRUNCATE TABLE clinic_payouts, leaderboard_history, user_habits, wearable_logs, subscribers, clinics CASCADE;');

    // 2. Insert Clinic
    console.log('Inserting mock clinics...');
    await client.query(`
      INSERT INTO clinics (id, name, contact_email, referral_code, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO NOTHING;
    `, ['clinic_98a', 'Apex Longevity Clinic', 'contact@apexlongevity.com', 'APEX98']);

    // 3. Insert Subscriber
    console.log('Inserting mock subscribers...');
    await client.query(`
      INSERT INTO subscribers (id, email, first_name, last_name, birth_date, gender, cohort_id, referred_by_clinic_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING;
    `, [
      'sub_mark_d', 
      'mark@example.com', 
      'Mark', 
      'D.', 
      new Date('1981-06-06'), 
      'male', 
      'cohort_45_50_m', 
      'clinic_98a', 
      'active'
    ]);

    // 4. Insert Habits
    console.log('Inserting mock user habits...');
    const habits = [
      ['habit_1', 'sub_mark_d', 'Sleep Quality & Duration', '7.5h Target (Weekdays) | 8.5h Target (Weekends)', 'Optimal'],
      ['habit_2', 'sub_mark_d', 'Activity snacks & Zone 2', 'Walking snacks post-lunch/dinner + 30m zone 2 weekly', 'On Target'],
      ['habit_3', 'sub_mark_d', 'Co-Designed Hydration', '3L Baseline | +1L & minerals on social wine nights', 'Needs Input']
    ];

    for (const h of habits) {
      await client.query(`
        INSERT INTO user_habits (id, subscriber_id, habit_name, description, is_self_reported, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [h[0], h[1], h[2], h[3], h[4] === 'Needs Input']);
    }

    // 5. Insert Leaderboard History logs
    console.log('Inserting mock leaderboard logs...');
    await client.query(`
      INSERT INTO leaderboard_history (subscriber_id, cohort_id, week_start_date, individual_performance_score, cohort_median_ips, cohort_normalization_index, cohort_rank, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT DO NOTHING;
    `, [
      'sub_mark_d',
      'cohort_45_50_m',
      new Date('2026-06-01'),
      94.6,
      92.2,
      1.4,
      5
    ]);

    console.log('Database successfully seeded!');
  } catch (err) {
    console.error('Error during database seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
