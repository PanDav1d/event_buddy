﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using eventbuddy_api.Data;

#nullable disable

namespace eventbuddy_api.Migrations
{
    [DbContext(typeof(EventbuddyDbContext))]
    [Migration("20241026123845_AddedForeignKeyTicketEvent")]
    partial class AddedForeignKeyTicketEvent
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("eventbuddy_api.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AttendeeCount")
                        .HasColumnType("int");

                    b.Property<float>("AverageRating")
                        .HasColumnType("real");

                    b.Property<float>("Crowdedness")
                        .HasColumnType("real");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<float>("EventSize")
                        .HasColumnType("real");

                    b.Property<string>("EventType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Interactivity")
                        .HasColumnType("real");

                    b.Property<float?>("Latitude")
                        .HasColumnType("real");

                    b.Property<float?>("Longitude")
                        .HasColumnType("real");

                    b.Property<int?>("MaxTickets")
                        .HasColumnType("int");

                    b.Property<string>("MusicStyles")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Noisiness")
                        .HasColumnType("real");

                    b.Property<int>("OrganizerId")
                        .HasColumnType("int");

                    b.Property<int>("SoldTickets")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Event");
                });

            modelBuilder.Entity("eventbuddy_api.Models.FriendRequest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime2");

                    b.Property<int>("FromUserId")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ToUserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FromUserId");

                    b.HasIndex("ToUserId");

                    b.ToTable("FriendRequest");
                });

            modelBuilder.Entity("eventbuddy_api.Models.Friendship", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("FriendshipDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId1")
                        .HasColumnType("int");

                    b.Property<int>("UserId2")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId1");

                    b.HasIndex("UserId2");

                    b.ToTable("Friendship");
                });

            modelBuilder.Entity("eventbuddy_api.Models.SavedEvent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("EventId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("SavedEvent");
                });

            modelBuilder.Entity("eventbuddy_api.Models.Ticket", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("EventId")
                        .HasColumnType("int");

                    b.Property<bool>("IsValid")
                        .HasColumnType("bit");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<int?>("PreviousOwnerId")
                        .HasColumnType("int");

                    b.Property<string>("QRCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ResoldAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("SecurityHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UniqueIdentifier")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UsedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("Ticket");
                });

            modelBuilder.Entity("eventbuddy_api.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("BuddyName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("EventId")
                        .HasColumnType("int");

                    b.Property<int>("EventsAttended")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastActiveDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("PreferredCrowdedness")
                        .HasColumnType("real");

                    b.Property<float>("PreferredEventSize")
                        .HasColumnType("real");

                    b.Property<string>("PreferredEventTypes")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("PreferredInteractivity")
                        .HasColumnType("real");

                    b.Property<string>("PreferredMusicStyles")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("PreferredNoisiness")
                        .HasColumnType("real");

                    b.Property<float>("SocialScore")
                        .HasColumnType("real");

                    b.Property<float>("UserActivityLevel")
                        .HasColumnType("real");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("User");
                });

            modelBuilder.Entity("eventbuddy_api.Models.FriendRequest", b =>
                {
                    b.HasOne("eventbuddy_api.Models.User", "FromUser")
                        .WithMany("SentFriendRequests")
                        .HasForeignKey("FromUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("eventbuddy_api.Models.User", "ToUser")
                        .WithMany("ReceivedFriendRequests")
                        .HasForeignKey("ToUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("FromUser");

                    b.Navigation("ToUser");
                });

            modelBuilder.Entity("eventbuddy_api.Models.Friendship", b =>
                {
                    b.HasOne("eventbuddy_api.Models.User", "User1")
                        .WithMany("Friendships")
                        .HasForeignKey("UserId1")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("eventbuddy_api.Models.User", "User2")
                        .WithMany()
                        .HasForeignKey("UserId2")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User1");

                    b.Navigation("User2");
                });

            modelBuilder.Entity("eventbuddy_api.Models.Ticket", b =>
                {
                    b.HasOne("eventbuddy_api.Models.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Event");
                });

            modelBuilder.Entity("eventbuddy_api.Models.User", b =>
                {
                    b.HasOne("eventbuddy_api.Models.Event", null)
                        .WithMany("Attendees")
                        .HasForeignKey("EventId");
                });

            modelBuilder.Entity("eventbuddy_api.Models.Event", b =>
                {
                    b.Navigation("Attendees");
                });

            modelBuilder.Entity("eventbuddy_api.Models.User", b =>
                {
                    b.Navigation("Friendships");

                    b.Navigation("ReceivedFriendRequests");

                    b.Navigation("SentFriendRequests");
                });
#pragma warning restore 612, 618
        }
    }
}
