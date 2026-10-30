using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Models;

namespace ArManagement.Api.Data
{
    public class ArDbContext : DbContext
    {
        public ArDbContext(DbContextOptions<ArDbContext> options) : base(options)
        {
        }

        public DbSet<ArSatker> Satkers { get; set; } = null!;
        public DbSet<ArWajibBayar> WajibBayars { get; set; } = null!;
        public DbSet<ArJenisPnbp> JenisPnbps { get; set; } = null!;
        public DbSet<ArDokumenDasar> DokumenDasars { get; set; } = null!;
        public DbSet<ArKualitasAging> KualitasAgings { get; set; } = null!;
        public DbSet<ArPiutang> Piutangs { get; set; } = null!;
        public DbSet<ArPiutangHistori> PiutangHistoris { get; set; } = null!;
        public DbSet<ArPembayaran> Pembayarans { get; set; } = null!;
        public DbSet<ArPenagihanLog> PenagihanLogs { get; set; } = null!;
        public DbSet<ArPenagihanDokumen> PenagihanDokumens { get; set; } = null!;
        public DbSet<ArUploadBatch> UploadBatches { get; set; } = null!;
        public DbSet<ArUploadBatchDetail> UploadBatchDetails { get; set; } = null!;
        public DbSet<ArSnapshotPeriodik> SnapshotPeriodiks { get; set; } = null!;
        public DbSet<ArSaktiExportLog> SaktiExportLogs { get; set; } = null!;
        public DbSet<ArAuditLog> AuditLogs { get; set; } = null!;
        public DbSet<ArRole> Roles { get; set; } = null!;
        public DbSet<ArUser> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Additional configurations if needed
            modelBuilder.Entity<ArWajibBayar>()
                .HasIndex(w => new { w.JenisIdentitas, w.NomorIdentitas })
                .IsUnique();

            modelBuilder.Entity<ArPiutang>()
                .HasIndex(p => p.NomorRegistrasiPiutang)
                .IsUnique();
        }
    }
}
