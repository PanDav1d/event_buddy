using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eventbuddy_api.Migrations
{
    /// <inheritdoc />
    public partial class AddingCustom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "User",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EventsAttended",
                table: "User",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastActiveDate",
                table: "User",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<float>(
                name: "PreferredCrowdedness",
                table: "User",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "PreferredEventSize",
                table: "User",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "PreferredEventTypes",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<float>(
                name: "PreferredInteractivity",
                table: "User",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "PreferredMusicStyles",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<float>(
                name: "PreferredNoisiness",
                table: "User",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "SocialScore",
                table: "User",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "UserActivityLevel",
                table: "User",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<int>(
                name: "AttendeeCount",
                table: "Event",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "AverageRating",
                table: "Event",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Crowdedness",
                table: "Event",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "EventSize",
                table: "Event",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "EventType",
                table: "Event",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<float>(
                name: "Interactivity",
                table: "Event",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "MusicStyles",
                table: "Event",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<float>(
                name: "Noisiness",
                table: "Event",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.CreateIndex(
                name: "IX_User_EventId",
                table: "User",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Event_EventId",
                table: "User",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Event_EventId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_EventId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "EventsAttended",
                table: "User");

            migrationBuilder.DropColumn(
                name: "LastActiveDate",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredCrowdedness",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredEventSize",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredEventTypes",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredInteractivity",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredMusicStyles",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredNoisiness",
                table: "User");

            migrationBuilder.DropColumn(
                name: "SocialScore",
                table: "User");

            migrationBuilder.DropColumn(
                name: "UserActivityLevel",
                table: "User");

            migrationBuilder.DropColumn(
                name: "AttendeeCount",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "Crowdedness",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "EventSize",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "EventType",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "Interactivity",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "MusicStyles",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "Noisiness",
                table: "Event");
        }
    }
}
