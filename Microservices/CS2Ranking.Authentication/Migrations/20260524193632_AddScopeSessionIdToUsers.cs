using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CS2Ranking.Authentication.Migrations
{
    /// <inheritdoc />
    public partial class AddScopeSessionIdToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "scope_session_id",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "scope_session_id",
                table: "AspNetUsers");
        }
    }
}
