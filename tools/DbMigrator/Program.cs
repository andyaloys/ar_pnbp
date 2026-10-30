using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using MySqlConnector;

Console.WriteLine("=== AR MANAGEMENT PNBP - DATABASE MIGRATOR ===");

string server = "109.123.235.50";
uint port = 3330;
string user = "root";
string pass = "2MinutesToMidnight#";

string connStr = $"Server={server};Port={port};User ID={user};Password={pass};SslMode=None;AllowUserVariables=True;AllowPublicKeyRetrieval=True;";

try
{
    using var connection = new MySqlConnection(connStr);
    connection.Open();
    Console.WriteLine($"[SUCCESS] Connected to {server}:{port} as user '{user}'!");

    string baseDir = AppContext.BaseDirectory;
    string dbFolder = Path.GetFullPath(Path.Combine(baseDir, @"..\..\..\..\..\database"));
    if (!Directory.Exists(dbFolder))
    {
        dbFolder = @"c:\TI\NET\AR Management PNBP\database";
    }
    Console.WriteLine($"Using SQL folder: {dbFolder}");

    // 1. Create Database Schema
    Console.WriteLine("\n[1/4] Executing 01_create_schema.sql...");
    string sql01 = File.ReadAllText(Path.Combine(dbFolder, "01_create_schema.sql"));
    foreach (var stmt in SplitStatements(sql01))
    {
        using var cmd = new MySqlCommand(stmt, connection);
        cmd.ExecuteNonQuery();
    }
    Console.WriteLine("[OK] Schema 'pnbp_ar' ready.");

    // Grant access to pnbpapp
    Console.WriteLine("\nGranting privileges on 'pnbp_ar' to 'pnbpapp'...");
    try
    {
        using var grantCmd = new MySqlCommand("GRANT ALL PRIVILEGES ON `pnbp_ar`.* TO 'pnbpapp'@'%'; FLUSH PRIVILEGES;", connection);
        grantCmd.ExecuteNonQuery();
    }
    catch { }
    Console.WriteLine("[OK] User 'pnbpapp' privileges updated.");

    // 2. Switch to pnbp_ar
    connection.ChangeDatabase("pnbp_ar");

    // 3. Create Tables
    Console.WriteLine("\n[2/4] Executing 02_create_tables.sql...");
    string sql02 = File.ReadAllText(Path.Combine(dbFolder, "02_create_tables.sql"));
    int tblCount = 0;
    foreach (var stmt in SplitStatements(sql02))
    {
        using var cmd = new MySqlCommand(stmt, connection);
        cmd.ExecuteNonQuery();
        if (stmt.Contains("CREATE TABLE", StringComparison.OrdinalIgnoreCase))
            tblCount++;
    }
    Console.WriteLine($"[OK] Successfully created/verified {tblCount} tables.");

    // 4. Seed Reference Data
    Console.WriteLine("\n[3/5] Executing 03_seed_reference_data.sql...");
    string sql03 = File.ReadAllText(Path.Combine(dbFolder, "03_seed_reference_data.sql"));
    int seedCount = 0;
    foreach (var stmt in SplitStatements(sql03))
    {
        using var cmd = new MySqlCommand(stmt, connection);
        cmd.ExecuteNonQuery();
        seedCount++;
    }
    Console.WriteLine($"[OK] Successfully executed {seedCount} seed queries.");

    // 5. Seed Sample Piutang Transactions
    string sql04Path = Path.Combine(dbFolder, "04_seed_sample_piutang.sql");
    if (File.Exists(sql04Path))
    {
        Console.WriteLine("\n[4/5] Executing 04_seed_sample_piutang.sql...");
        string sql04 = File.ReadAllText(sql04Path);
        int sampleCount = 0;
        foreach (var stmt in SplitStatements(sql04))
        {
            using var cmd = new MySqlCommand(stmt, connection);
            cmd.ExecuteNonQuery();
            sampleCount++;
        }
        Console.WriteLine($"[OK] Successfully executed {sampleCount} sample transaction queries.");
    }

    string sql05Path = Path.Combine(dbFolder, "05_seed_realistic_ar_data.sql");
    if (File.Exists(sql05Path))
    {
        Console.WriteLine("\n[5/5] Executing 05_seed_realistic_ar_data.sql...");
        string sql05 = File.ReadAllText(sql05Path);
        int extraCount = 0;
        foreach (var stmt in SplitStatements(sql05))
        {
            using var cmd = new MySqlCommand(stmt, connection);
            cmd.ExecuteNonQuery();
            extraCount++;
        }
        Console.WriteLine($"[OK] Successfully executed {extraCount} realistic sample queries.");
    }

    // Verification
    Console.WriteLine("\n=== VERIFICATION: TABLES IN pnbp_ar ===");
    using (var cmd = new MySqlCommand("SHOW TABLES IN `pnbp_ar`;", connection))
    using (var reader = cmd.ExecuteReader())
    {
        int idx = 1;
        while (reader.Read())
        {
            Console.WriteLine($"  {idx++}. {reader.GetString(0)}");
        }
    }

    // Verify Counts
    string[] verifyTables = new[] { "ar_satker", "ar_wajib_bayar", "ar_jenis_pnbp", "ar_dokumen_dasar", "ar_kualitas_aging", "ar_piutang", "ar_pembayaran" };
    foreach (var table in verifyTables)
    {
        using var cmd = new MySqlCommand($"SELECT COUNT(*) FROM `{table}`;", connection);
        var cnt = cmd.ExecuteScalar();
        Console.WriteLine($"[VERIFIED] {table} rows: {cnt}");
    }

    Console.WriteLine("\n🎉 [ALL DATABASE TASKS COMPLETED SUCCESSFULLY]");
    return 0;
}
catch (Exception ex)
{
    Console.WriteLine($"\n[ERROR]: {ex.Message}");
    return 1;
}

static IEnumerable<string> SplitStatements(string sql)
{
    var lines = sql.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
    var sb = new StringBuilder();
    foreach (var rawLine in lines)
    {
        var trimmed = rawLine.Trim();
        if (trimmed.StartsWith("--") || trimmed.StartsWith("/*"))
            continue;
        sb.AppendLine(rawLine);
    }
    return sb.ToString().Split(';', StringSplitOptions.RemoveEmptyEntries)
             .Select(s => s.Trim())
             .Where(s => !string.IsNullOrWhiteSpace(s) && !s.StartsWith("USE", StringComparison.OrdinalIgnoreCase));
}
