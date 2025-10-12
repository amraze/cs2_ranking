using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CS2Ranking.Infrastructure.Data.Migrations
{
    public partial class CreateMatch : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase().Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Match",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false).Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    outcome = table.Column<int>(type: "int", nullable: false),
                    map_id = table.Column<int>(type: "int", nullable: false),
                    season_id = table.Column<int>(type: "int", nullable: false),
                    datetime = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Match", x => x.id);
                    table.ForeignKey( name: "FK_Match_Map", column: x => x.map_id, principalTable: "Map", principalColumn: "id", onDelete: ReferentialAction.Restrict);
                    table.ForeignKey( name: "FK_Match_Season", column: x => x.season_id, principalTable: "Season", principalColumn: "id", onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex( name: "IDX_map_id", table: "Match", column: "map_id");
            migrationBuilder.CreateIndex( name: "IDX_season_id", table: "Match", column: "season_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Match");
        }
    }
}
