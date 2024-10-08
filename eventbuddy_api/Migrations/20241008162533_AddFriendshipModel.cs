using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eventbuddy_api.Migrations
{
    /// <inheritdoc />
    public partial class AddFriendshipModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedEvent_Event_EventId",
                table: "SavedEvent");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedEvent_User_UserId",
                table: "SavedEvent");

            migrationBuilder.DropIndex(
                name: "IX_SavedEvent_EventId",
                table: "SavedEvent");

            migrationBuilder.DropIndex(
                name: "IX_SavedEvent_UserId",
                table: "SavedEvent");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "User",
                newName: "Username");

            migrationBuilder.CreateTable(
                name: "FriendRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromUserId = table.Column<int>(type: "int", nullable: false),
                    ToUserId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FriendRequest_User_FromUserId",
                        column: x => x.FromUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FriendRequest_User_ToUserId",
                        column: x => x.ToUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Friendship",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId1 = table.Column<int>(type: "int", nullable: false),
                    UserId2 = table.Column<int>(type: "int", nullable: false),
                    FriendshipDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendship", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Friendship_User_UserId1",
                        column: x => x.UserId1,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Friendship_User_UserId2",
                        column: x => x.UserId2,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequest_FromUserId",
                table: "FriendRequest",
                column: "FromUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequest_ToUserId",
                table: "FriendRequest",
                column: "ToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_UserId1",
                table: "Friendship",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_UserId2",
                table: "Friendship",
                column: "UserId2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FriendRequest");

            migrationBuilder.DropTable(
                name: "Friendship");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "User",
                newName: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEvent_EventId",
                table: "SavedEvent",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEvent_UserId",
                table: "SavedEvent",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedEvent_Event_EventId",
                table: "SavedEvent",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SavedEvent_User_UserId",
                table: "SavedEvent",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
