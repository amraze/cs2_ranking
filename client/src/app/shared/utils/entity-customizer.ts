interface CustomizationRule {
    classes?: string[];
    text?: string;
    range?: [number, number];
}

export class EntityCustomizer {
    private static entityCustomizer: Record<
        string,
        Record<string, CustomizationRule> | CustomizationRule[]> = {
            matchOutcome: {
                0: { classes: ['bg-opacity-10', 'bg-danger', 'text-danger'], text: 'LOSS' },
                1: { classes: ['bg-opacity-10', 'bg-warning', 'text-warning'], text: 'DRAW' },
                2: { classes: ['bg-opacity-10', 'bg-success', 'text-success'], text: 'WIN' },
            },

            matchOutcomeBorder: {
                0: { classes: ['border-danger'] },
                1: { classes: ['border-warning'] },
                2: { classes: ['border-success'] },
            },

            hltv: [
                { range: [0, 0.799], classes: ['hltv-poor'], text: 'Poor performance' },
                { range: [0.8, 0.999], classes: ['hltv-average'], text: 'Average performance' },
                { range: [1, 1.199], classes: ['hltv-good'], text: 'Good performance' },
                { range: [1.2, 1.599], classes: ['hltv-great'], text: 'Great performance' },
                { range: [1.6, Infinity], classes: ['hltv-excellent'], text: 'Excellent performance' },
            ],

            adr: [
                { range: [0, 69.9], classes: ['text-danger'], text: 'Poor performance' },
                { range: [70, 89], classes: ['text-warning'], text: 'Average performance' },
                { range: [90, Infinity], classes: ['text-success'], text: 'Good performance' },
            ],

            kdRatio: [
                { range: [0, 0.99], classes: ['text-danger'], text: 'Poor performance' },
                { range: [1, Infinity], classes: ['text-success'], text: 'Good performance' },
            ],

            ranks: {
                1: { classes: ['common'] },
                2: { classes: ['uncommon'] },
            },
        };

    private static getEntityRule(entity: string, state: any): CustomizationRule | undefined {
        const entityMap = this.entityCustomizer[entity];
        if (!entityMap) return;

        if (Array.isArray(entityMap)) {
            return entityMap.find(
                (r) =>
                    typeof state === 'number' &&
                    r.range &&
                    state >= r.range[0] &&
                    state < r.range[1]
            );
        }

        return entityMap[state] || entityMap['default'];
    }

    static getClasses(entity: string, state: any): string[] {
        const rule = this.getEntityRule(entity, state);
        return rule?.classes || [];
    }

    static getText(entity: string, state: any): string {
        const rule = this.getEntityRule(entity, state);
        return rule?.text || '';
    }
}
