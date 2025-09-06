using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CS2Ranking.Infrastructure.Data.Migrations
{
    public partial class CreateMatchResult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase().Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Match_Result",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false).Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    match_id = table.Column<int>(type: "int", nullable: false),
                    kills = table.Column<int>(type: "int", nullable: false),
                    assists = table.Column<int>(type: "int", nullable: false),
                    deaths = table.Column<int>(type: "int", nullable: false),
                    mvps = table.Column<int>(type: "int", nullable: false),
                    hsp = table.Column<int>(type: "double", nullable: false),
                    score = table.Column<int>(type: "int", nullable: false),
                    adr = table.Column<int>(type: "int", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchResult", x => x.id);
                    table.ForeignKey( name: "FK_MatchResult_Match", column: x => x.match_id, principalTable: "Match", principalColumn: "id", onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex( name: "IDX_match_id", table: "Match_Result", column: "match_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Match_Result");
        }
    }
}
