import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  public type Festival = {
    id : Nat;
    nameOdia : Text;
    nameEnglish : Text;
    description : Text;
    month : Nat; // 1-12 (Gregorian)
    day : Nat; // 1-31
  };

  public type TithiEvent = {
    name : Text;
    description : Text;
    lunarMonth : Text;
    tithi : Text;
  };

  module Festival {
    public func compare(f1 : Festival, f2 : Festival) : Order.Order {
      switch (Nat.compare(f1.month, f2.month)) {
        case (#equal) {
          switch (Nat.compare(f1.day, f2.day)) {
            case (#equal) { f1.nameEnglish.compare(f2.nameEnglish) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  var nextFestivalId = 1;
  let festivals = Map.empty<Nat, Festival>();
  let tithiEvents = Map.empty<Nat, TithiEvent>();

  // Add Festival (Admin only)
  public shared ({ caller }) func addFestival(
    nameOdia : Text,
    nameEnglish : Text,
    description : Text,
    month : Nat,
    day : Nat,
  ) : async Nat {
    let id = nextFestivalId;
    let festival : Festival = {
      id;
      nameOdia;
      nameEnglish;
      description;
      month;
      day;
    };
    festivals.add(id, festival);
    nextFestivalId += 1;
    id;
  };

  // Update Festival (Admin only)
  public shared ({ caller }) func updateFestival(
    id : Nat,
    nameOdia : Text,
    nameEnglish : Text,
    description : Text,
    month : Nat,
    day : Nat,
  ) : async () {
    switch (festivals.get(id)) {
      case (null) { Runtime.trap("Festival not found") };
      case (?_) {
        let festival : Festival = {
          id;
          nameOdia;
          nameEnglish;
          description;
          month;
          day;
        };
        festivals.add(id, festival);
      };
    };
  };

  // Delete Festival (Admin only)
  public shared ({ caller }) func deleteFestival(id : Nat) : async () {
    if (not festivals.containsKey(id)) {
      Runtime.trap("Festival not found");
    };
    festivals.remove(id);
  };

  // Get all festivals
  public query ({ caller }) func getAllFestivals() : async [Festival] {
    festivals.values().toArray().sort();
  };

  // Get festivals by month
  public query ({ caller }) func getFestivalsByMonth(month : Nat) : async [Festival] {
    festivals.values().toArray().filter(
      func(festival) { festival.month == month }
    ).sort();
  };

  // Get festivals by date range
  public query ({ caller }) func getFestivalsByDateRange(
    startMonth : Nat,
    startDay : Nat,
    endMonth : Nat,
    endDay : Nat,
  ) : async [Festival] {
    let filtered = festivals.values().toArray().filter(
      func(festival) {
        isInRange(festival.month, festival.day, startMonth, startDay, endMonth, endDay);
      }
    );
    filtered.sort();
  };

  // Helper: Check if date is in range
  func isInRange(month : Nat, day : Nat, startMonth : Nat, startDay : Nat, endMonth : Nat, endDay : Nat) : Bool {
    let start = { month = startMonth; day = startDay };
    let end = { month = endMonth; day = endDay };
    let current = { month; day };

    switch (compareDates(current, start)) {
      case (#less) { return false };
      case (_) {};
    };

    switch (compareDates(current, end)) {
      case (#greater) { return false };
      case (_) { true };
    };
  };

  // Helper: Compare dates
  func compareDates(a : { month : Nat; day : Nat }, b : { month : Nat; day : Nat }) : Order.Order {
    switch (Nat.compare(a.month, b.month)) {
      case (#equal) { Nat.compare(a.day, b.day) };
      case (order) { order };
    };
  };

  // Add Tithi Event (Admin only)
  public shared ({ caller }) func addTithiEvent(
    name : Text,
    description : Text,
    lunarMonth : Text,
    tithi : Text,
  ) : async Nat {
    let id = tithiEvents.size() + 1;
    let event : TithiEvent = {
      name;
      description;
      lunarMonth;
      tithi;
    };
    tithiEvents.add(id, event);
    id;
  };

  // Get all Tithi events
  public query ({ caller }) func getAllTithiEvents() : async [TithiEvent] {
    tithiEvents.values().toArray();
  };
};
