/**
 * Wraps the details for the code to be generated
 * The mutationCode gets applied if there are 1 or more mutations caught
 *
 */
export class UserEvent {
  constructor(public playbackCode: string, public mutationCode: string) {}
}
