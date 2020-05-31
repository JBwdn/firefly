class Swarm {
    constructor(n_fly) {
        this.fly_list = []
        for (let i = 0; i < n_fly; i++) {
            this.fly_list.push(new Firefly());
        }
    }

    swarm() {
        let snapshot = [...this.fly_list]
        for (let fly of this.fly_list) {
            fly.loop_edges();
            fly.flock_behaviour(snapshot);
            fly.update_mech();
            fly.flashing(this.fly_list, snapshot);
            fly.draw_fly();
        }
    }
}