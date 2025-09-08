using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CS2Ranking.Infrastructure.Data.Migrations
{
    public partial class CreateMatchRank : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase().Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Match_Rank",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false).Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    match_id = table.Column<int>(type: "int", nullable: false),
                    rank_id = table.Column<int>(type: "int", nullable: false),
                    rank_score = table.Column<int>(type: "int", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchRank", x => x.id);
                    table.ForeignKey( name: "FK_MatchRank_Match", column: x => x.match_id, principalTable: "Match", principalColumn: "id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey( name: "FK_MatchRank_Rank", column: x => x.rank_id, principalTable: "Rank", principalColumn: "id", onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex( name: "IDX_match_id", table: "Match_Rank", column: "match_id");
            migrationBuilder.CreateIndex( name: "IDX_rank_id", table: "Match_Rank", column: "rank_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Match_Rank");
        }
    }
}
